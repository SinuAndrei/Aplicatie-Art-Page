import connectDB from '../db/connect';
import User from '../../../../models/userModel';
import jwt from 'jsonwebtoken';

export async function POST(req, res) {
  await connectDB();

  const body = await new Response(req.body).json();
  const { email, password } = body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    const token = generateToken(user._id);
    return new Response(JSON.stringify({ token }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=72000, stale-while-revalidate=300',
      },
    });
  } else {
    return new Response(
      JSON.stringify({ message: 'Invalid email or password' }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

function generateToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
}
