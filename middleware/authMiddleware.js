import jwt from 'jsonwebtoken';
import User from '@/models/userModel';
import { NextResponse } from 'next/server';

export const config = {
  runtime: 'edge', // Rulează la Edge pentru răspuns instant
};

const authMiddleware = async (req) => {
  const token = req.headers.get('authorization')?.split(' ')[1];

  if (!token) {
    return NextResponse.json(
      { message: 'Not authorized, no token' },
      { status: 401 }
    );
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return NextResponse.json(
        { message: 'Not authorized, user not found' },
        { status: 401 }
      );
    }
    req.user = user;
    return NextResponse.next();
  } catch (error) {
    return NextResponse.json(
      { message: 'Not authorized, token failed' },
      { status: 401 }
    );
  }
};

export default authMiddleware;
