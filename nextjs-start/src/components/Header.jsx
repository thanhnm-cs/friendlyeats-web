'use client'
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
	signInWithGoogle,
	signOut,
	onAuthStateChanged
} from "@/src/lib/firebase/auth.js";
import { addFakeRestaurantsAndReviews } from "@/src/lib/firebase/firestore.js";
import { useRouter } from "next/navigation";

function useUserSession(initialUser) {
	// The initialUser comes from the server through a server component
	const [user, setUser] = useState(initialUser);
	const router = useRouter();

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(authUser => {
			setUser(authUser);
		});
		return () => {
			unsubscribe();
		};
	}, []);

	useEffect(() => {
		onAuthStateChanged(authUser => {
			if (user === undefined) return;
			if (user?.email !== authUser?.email) {
				router.refresh();
			}
		});
	}, [user]);

	return user;
}

export default function Header({ initialUser }) {

	const user = useUserSession(initialUser);

	const handleSignOut = event => {
		event.preventDefault();
		signOut();
	};

	const handleSignIn = event => {
		event.preventDefault();
		signInWithGoogle();
	};

	return (
		<header>
			<Link href="/" className="logo">
				<img src="/friendly-eats.svg" alt="FriendlyEats" />
				Friendly Eats2
			</Link>
			{user ? (
				<>
					<div className="profile">
						<p>
							<img src="/profile.svg" alt={user.email} />
							{user.displayName}
						</p>

						<div className="menu">
							...
							<ul>
								<li>{user.displayName}</li>

								<li>
									<a
										href="#"
										onClick={addFakeRestaurantsAndReviews}
									>
										Add sample restaurants
									</a>
								</li>

								<li>
									<a href="#" onClick={handleSignOut}>
										Sign Out
									</a>
								</li>
							</ul>
						</div>
					</div>
				</>
			) : (
				<a href="#" onClick={handleSignIn}>
					Sign In with Google
				</a>
			)}
		</header>
	);
}
