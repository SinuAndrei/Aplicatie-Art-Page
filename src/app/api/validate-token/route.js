import jwt from 'jsonwebtoken';
import connectDB from '@/src/app/api/db/connect';
import User from '@/models/userModel';

export const config = {
  runtime: 'edge', // Rulează la Edge pentru răspuns instant
};

export async function GET(req) {
  await connectDB();

  const token = req.headers.get('authorization')?.split(' ')[1]; // Folosește metoda get pentru a obține antetul

  if (!token) {
    return new Response(
      JSON.stringify({ message: 'Not authorized, no token' }),
      {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return new Response(
        JSON.stringify({ message: 'Not authorized, token failed!' }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Verifică dacă token-ul este expirat
    const currentTime = Math.floor(new Date().getTime() / 1000); // Timpul curent în secunde
    if (decoded.exp < currentTime) {
      return new Response(JSON.stringify({ message: 'Token expired' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return new Response(
      JSON.stringify({ message: 'Token is valid', user: user }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=72000, stale-while-revalidate=300',
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: 'Not authorized, token failed.' }),
      {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
