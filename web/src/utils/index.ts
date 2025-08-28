/* eslint-disable @typescript-eslint/no-explicit-any */
export const getAuthHeaders = () => {
    const accessToken = localStorage.getItem('accessToken');
    return {
        Authorization: `Bearer ${accessToken}`,
    };
};
export const splitContentAndHashtagsAndFriends = (
    text: string
): { content: string; hashtags: string[]; friends: string[] } => {
    if (!text) return { content: "", hashtags: [], friends: [] };

    const words = text.split(/\s+/);

    const hashtags = words.filter(word => /^#[\p{L}0-9_-]+$/u.test(word));
    const friends = words.filter(word => /^@[\p{L}0-9_-]+$/u.test(word));

    const content = words
        .filter(
            word =>
                !/^#[\p{L}0-9_-]+$/u.test(word) &&
                !/^@[\p{L}0-9_-]+$/u.test(word)
        )
        .join(" ")
        .trim();

    return {
        content,
        hashtags: Array.from(new Set(hashtags.map(tag => tag.slice(1)))),
        friends: Array.from(new Set(friends.map(tag => tag.slice(1))))
    };
};

export const formatDate = (date: string) => {
    const now = new Date();
    const past = new Date(date);
    const diff = Math.floor((now.getTime() - past.getTime()) / 1000); // giây

    if (diff < 60) return "Just now";
    if (diff < 3600) {
        const mins = Math.floor(diff / 60);
        return `${mins} minute${mins === 1 ? "" : "s"} ago`;
    }
    if (diff < 86400) {
        const hrs = Math.floor(diff / 3600);
        return `${hrs} hour${hrs === 1 ? "" : "s"} ago`;
    }
    if (diff < 2592000) {
        const days = Math.floor(diff / 86400);
        return `${days} day${days === 1 ? "" : "s"} ago`;
    }
    if (diff < 31536000) {
        const months = Math.floor(diff / 2592000);
        return `${months} month${months === 1 ? "" : "s"} ago`;
    }
    const years = Math.floor(diff / 31536000);
    return `${years} year${years === 1 ? "" : "s"} ago`;


};

export const extractHashtagsAndContent = (text: string) => {
    const hashtagRegex = /#[\w\u00C0-\u1EF9]+/g;
    const hashtags: string[] = [];
    const content = text.replace(hashtagRegex, (match) => {
        hashtags.push(match.trim());
        return '';
    }).trim();

    return { content, hashtags };
};
export const isEqual = (a: any, b: any): boolean => {
    if (a === b) return true;

    if (typeof a !== typeof b) return false;

    if (a && b && typeof a === "object") {
        if (Array.isArray(a)) {
            if (!Array.isArray(b) || a.length !== b.length) return false;
            return a.every((item, index) => isEqual(item, b[index]));
        }

        const keysA = Object.keys(a);
        const keysB = Object.keys(b);

        if (keysA.length !== keysB.length) return false;

        return keysA.every(key => isEqual(a[key], b[key]));
    }

    return false;
}
