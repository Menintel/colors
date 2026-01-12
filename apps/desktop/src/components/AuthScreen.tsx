// Login/Signup component

import { Loader2, Lock, Mail, Palette } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '../stores';
import './AuthScreen.css';

export function AuthScreen() {
	const [isLogin, setIsLogin] = useState(true);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const { signIn, signUp, isLoading, error, clearError } = useAuthStore();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		clearError();

		if (isLogin) {
			await signIn(email, password);
		} else {
			const success = await signUp(email, password);
			if (success) {
				// After signup, show message about email confirmation
				alert('Check your email to confirm your account!');
			}
		}
	};

	return (
		<div className="auth-screen">
			<div className="auth-card">
				<div className="auth-header">
					<Palette size={32} className="auth-logo" />
					<h1>Colors</h1>
					<p>A lightweight color palette application</p>
				</div>

				<form className="auth-form" onSubmit={handleSubmit}>
					<h2>{isLogin ? 'Welcome back' : 'Create account'}</h2>

					{error && <div className="auth-error">{error}</div>}

					<div className="form-group">
						<label htmlFor="email">
							<Mail size={18} />
							Email
						</label>
						<input
							id="email"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="you@example.com"
							required
							disabled={isLoading}
						/>
					</div>

					<div className="form-group">
						<label htmlFor="password">
							<Lock size={18} />
							Password
						</label>
						<input
							id="password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="••••••••"
							required
							minLength={6}
							disabled={isLoading}
						/>
					</div>

					<button type="submit" className="auth-submit" disabled={isLoading}>
						{isLoading ? (
							<>
								<Loader2 size={18} className="spinner" />
								Loading...
							</>
						) : isLogin ? (
							'Sign In'
						) : (
							'Create Account'
						)}
					</button>
				</form>

				<div className="auth-footer">
					<p>
						{isLogin ? "Don't have an account?" : 'Already have an account?'}
						<button
							type="button"
							className="switch-mode-btn"
							onClick={() => {
								setIsLogin(!isLogin);
								clearError();
							}}
						>
							{isLogin ? 'Sign up' : 'Sign in'}
						</button>
					</p>
				</div>
			</div>
		</div>
	);
}
