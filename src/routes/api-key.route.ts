import { Router } from "express";
import { ApiKeyService } from "../services/api-key.service";
import { formatError } from "../utils/errors";

const router = Router();

router.get("/:clientId", async (req, res) => {
  try {
    const { clientId } = req.params;

    if (!clientId) {
      return res.status(400).json({ message: "Missing clientId" });
    }

    const apiKey = await ApiKeyService.findByClientId(clientId);

    if (!apiKey) {
      return res.status(404).json({ message: "API key not found" });
    }

    return res.json({ key: apiKey.key, expiration: apiKey.expiration });
  } catch (error) {
    console.error(formatError("Error fetching API key", error));
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
