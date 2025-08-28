interface LocalUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
}

export function saveUserToLocalStorage(user: {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
}) {
  const localUser: LocalUser = {
    id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    bio: user.bio,
  };

  localStorage.setItem('isLoggedIn', 'true');
  localStorage.setItem('user', JSON.stringify(localUser));
}

export function getUserFromLocalStorage(): LocalUser | null {
  if (typeof window === 'undefined') return null; // tránh lỗi SSR

  const userStr = localStorage.getItem('user');
  try {
    return userStr ? JSON.parse(userStr) as LocalUser : null;
  } catch {
    return null;
  }
}

export function removeUserFromLocalStorage() {
  localStorage.removeItem('user');
  localStorage.removeItem('isLoggedIn');
}
