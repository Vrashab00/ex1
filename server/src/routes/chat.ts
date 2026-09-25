import { Router, Request, Response } from 'express';
import { chatService } from '../services/chatService.js';

export const chatRouter = Router();

chatRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      res.status(400).json({
        success: false,
        error: 'Message string is required in the request body.'
      });
      return;
    }

    const reply = await chatService.generateReply(message.trim(), Array.isArray(history) ? history : []);

    res.json({
      success: true,
      reply,
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    console.error('[ChatRouter] Error processing chat request:', err);
    res.status(500).json({
      success: false,
      error: err.message || 'Internal server error processing chat message.'
    });
  }
});
