'use client';

import { useState } from 'react';

export function useHomePage() {
    const [actionSideBar, setActiveSideBar] = useState(0);
    return { actionSideBar, setActiveSideBar };
}


