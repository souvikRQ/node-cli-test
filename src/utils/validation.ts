import { Model } from 'mongoose';

export const isObjectIdExists = async (model: Model<any>, id: string): Promise<boolean> => {
  try {
    const document = await model.findById(id);
    return !!document;
  } catch (error) {
    return false;
  }
};
