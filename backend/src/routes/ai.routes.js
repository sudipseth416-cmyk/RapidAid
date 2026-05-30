import { Router } from "express";
import { body } from "express-validator";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { streamFirstAidInstructions } from "../services/claude.service.js";

const router = Router();

router.post(
  "/first-aid",
  authenticate,
  body("emergencyType").optional().isString(),
  body("vitals").optional().isObject(),
  body("patientContext").optional().isString(),
  validate,
  async (req, res, next) => {
    try {
      const { emergencyType, vitals, patientContext } = req.body;

      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      res.flushHeaders?.();

      await streamFirstAidInstructions({
        emergencyType,
        vitals,
        patientContext,
        onChunk: (text) => {
          res.write(`data: ${JSON.stringify({ text })}\n\n`);
        },
        onDone: () => {
          res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
          res.end();
        },
        onError: (err) => {
          res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
          res.end();
        },
      });
    } catch (e) {
      if (!res.headersSent) {
        next(e);
      } else {
        res.end();
      }
    }
  }
);

export default router;
