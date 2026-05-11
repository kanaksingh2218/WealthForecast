import { Request, Response, NextFunction } from 'express';
import { ForecastService } from '../services/forecast.service';
import { Scenario } from '../models/Scenario.model';

export const computeForecast = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = req.body;
    const points = ForecastService.computeForecast(input);
    const fiDate = ForecastService.findFIDate(input, points);

    res.json({
      success: true,
      data: {
        points,
        fiDate,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getScenarios = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id || 'default_user';
    const scenarios = await Scenario.find({ userId }).sort({ isBaseline: -1, createdAt: -1 });
    res.json({ success: true, data: scenarios });
  } catch (error) {
    next(error);
  }
};

export const createScenario = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id || 'default_user';
    const { name, inputs, isBaseline } = req.body;

    if (isBaseline) {
      // Unset previous baseline
      await Scenario.updateMany({ userId }, { isBaseline: false });
    }

    const scenario = await Scenario.findOneAndUpdate(
      { userId, name },
      { inputs, isBaseline },
      { upsert: true, new: true }
    );

    res.json({ success: true, data: scenario });
  } catch (error) {
    next(error);
  }
};

export const deleteScenario = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id || 'default_user';

    const result = await Scenario.findOneAndDelete({ _id: id, userId });
    if (!result) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Scenario not found' } });
    }

    res.json({ success: true, message: 'Scenario deleted' });
  } catch (error) {
    next(error);
  }
};
