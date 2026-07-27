"""
VWV (Vazi Web Vision) Backend Engine.

Flask service that handles fine-tuning job submission and model merge
configuration for the VWV AI Model Studio. Deployed on Railway; the
Next.js frontend (deployed on Vercel) calls this service over HTTP.
"""

import os
import logging
from typing import Any, Dict, Optional, Tuple

from flask import Flask, request, jsonify, Response
from flask_cors import CORS

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("vwv-backend")

app = Flask(__name__)

# Restrict CORS to the deployed frontend origin in production. Falls back
# to "*" only when FRONTEND_ORIGIN is unset (e.g. local development).
FRONTEND_ORIGIN = os.environ.get("FRONTEND_ORIGIN", "*")
CORS(app, resources={r"/api/*": {"origins": FRONTEND_ORIGIN}})

HUGGINGFACE_TOKEN: str = os.environ.get("HUGGINGFACE_TOKEN", "")
GROQ_API_KEY: str = os.environ.get("GROQ_API_KEY", "")  # reserved for future VWV Engine calls

VALID_MERGE_METHODS = {"slerp", "ties", "dare", "linear"}


def error_response(message: str, status_code: int) -> Tuple[Response, int]:
    """Build a consistent JSON error payload and log the failure."""
    logger.warning("Request rejected (%s): %s", status_code, message)
    return jsonify({"error": message}), status_code


@app.route("/health", methods=["GET"])
def health() -> Tuple[Response, int]:
    """Health check used by Railway and uptime monitors."""
    return jsonify({
        "status": "ok",
        "service": "VWV Backend Engine",
        "huggingface_configured": bool(HUGGINGFACE_TOKEN),
        "groq_configured": bool(GROQ_API_KEY),
    }), 200


@app.route("/api/train", methods=["POST"])
def train_model() -> Tuple[Response, int]:
    """Queue a fine-tuning job for the given base model and dataset."""
    data: Optional[Dict[str, Any]] = request.get_json(silent=True)
    if data is None:
        return error_response("Request body must be valid JSON.", 400)

    base_model = data.get("base_model")
    dataset_url = data.get("dataset_url")
    epochs = data.get("epochs", 3)
    learning_rate = data.get("learning_rate", 2e-4)

    if not isinstance(base_model, str) or not base_model.strip():
        return error_response("Field 'base_model' is required and must be a non-empty string.", 400)
    if not isinstance(dataset_url, str) or not dataset_url.strip():
        return error_response("Field 'dataset_url' is required and must be a non-empty string.", 400)
    if not isinstance(epochs, (int, float)) or epochs <= 0:
        return error_response("Field 'epochs' must be a positive number.", 400)
    if not isinstance(learning_rate, (int, float)) or learning_rate <= 0:
        return error_response("Field 'learning_rate' must be a positive number.", 400)

    if not HUGGINGFACE_TOKEN:
        logger.warning("HUGGINGFACE_TOKEN is not set; queuing job without a configured token.")

    payload = {
        "model": base_model,
        "dataset": dataset_url,
        "hyperparameters": {
            "epochs": epochs,
            "learning_rate": learning_rate,
            "lora_r": 8,
            "lora_alpha": 16,
        },
    }

    # Placeholder response. Replace this block with the actual Hugging Face
    # AutoTrain / Inference Endpoint request once a training provider is wired up.
    job_id = f"vwv-job-{os.urandom(4).hex()}"
    return jsonify({
        "status": "QUEUED",
        "job_id": job_id,
        "message": f"Fine-tuning job queued for {base_model}.",
        "config": payload,
    }), 200


@app.route("/api/merge", methods=["POST"])
def merge_models() -> Tuple[Response, int]:
    """Build a merge configuration for two source models."""
    data: Optional[Dict[str, Any]] = request.get_json(silent=True)
    if data is None:
        return error_response("Request body must be valid JSON.", 400)

    model_a = data.get("model_a")
    model_b = data.get("model_b")
    method = data.get("method", "slerp")
    alpha = data.get("alpha", 0.5)

    if not isinstance(model_a, str) or not model_a.strip():
        return error_response("Field 'model_a' is required and must be a non-empty string.", 400)
    if not isinstance(model_b, str) or not model_b.strip():
        return error_response("Field 'model_b' is required and must be a non-empty string.", 400)
    if method not in VALID_MERGE_METHODS:
        return error_response(f"Field 'method' must be one of: {', '.join(sorted(VALID_MERGE_METHODS))}.", 400)
    if not isinstance(alpha, (int, float)) or not 0 <= alpha <= 1:
        return error_response("Field 'alpha' must be a number between 0 and 1.", 400)

    merged_config = {
        "merge_method": method,
        "models": [
            {"model": model_a, "weight": alpha},
            {"model": model_b, "weight": 1.0 - alpha},
        ],
    }

    # Placeholder response. Replace this block with the actual Mergekit
    # invocation once the merge worker is implemented.
    return jsonify({
        "status": "SUCCESS",
        "merged_model_name": f"vwv-merged-{method}",
        "merge_config": merged_config,
    }), 200


@app.errorhandler(404)
def not_found(_e: Exception) -> Tuple[Response, int]:
    return error_response("Route not found.", 404)


@app.errorhandler(500)
def internal_error(_e: Exception) -> Tuple[Response, int]:
    return error_response("Internal server error.", 500)


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    debug_mode = os.environ.get("FLASK_DEBUG", "false").lower() == "true"
    app.run(host="0.0.0.0", port=port, debug=debug_mode)
