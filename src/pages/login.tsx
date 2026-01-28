import { zodResolver } from '@hookform/resolvers/zod';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { auth } from '../lib/fitebase';
import { loginSchema, type LoginSchema } from '../schemas/auth.schema';

export default function Login() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onSubmit',
  });

  async function onSubmit(data: LoginSchema) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      const user = userCredential.user;

      toast.success('Logged in successfully');
      navigate('/');
    } catch (error) {
      toast.error('Failed to login', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  return (
    <div className="flex justify-center items-center h-screen p-10 overflow-y-auto">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 w-full max-w-2xl h-max shadow-md p-4 rounded-lg border text-primary"
      >
        <h1 className="text-2xl font-bold text-center">Register</h1>

        <div className="space-y-2">
          <label htmlFor="email" className="label text-sm font-semibold">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Email"
            {...register('email')}
            className="input input-bordered w-full bg-gray-100 text-black"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <label htmlFor="password" className="label text-sm font-semibold">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Password"
            {...register('password')}
            className="input input-bordered w-full bg-gray-100 text-black"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>
        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="loading loading-spinner loading-xs"></span>
          ) : (
            'Login'
          )}
        </button>
        <span className="text-sm text-center text-secondary">
          Already have an account?{' '}
          <Link to="/register" className="text-primary hover:underline">
            Register
          </Link>
        </span>
      </form>
    </div>
  );
}
