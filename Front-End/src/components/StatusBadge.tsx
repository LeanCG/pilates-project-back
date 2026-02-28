import React from 'react';

interface StatusBadgeProps {
    active: boolean;
}

// rendering-hoist-jsx: styles are constant, no re-computation
const activeStyle = { background: 'rgba(80,200,120,0.15)', color: 'var(--success)', border: '1px solid var(--success)', padding: '2px 10px', borderRadius: '999px', fontSize: '0.78rem', fontWeight: 600 };
const inactiveStyle = { background: 'rgba(255,77,77,0.12)', color: 'var(--error)', border: '1px solid var(--error)', padding: '2px 10px', borderRadius: '999px', fontSize: '0.78rem', fontWeight: 600 };

/**
 * A memoized badge component used to display 'Activo' or 'Inactivo' statuses.
 * Uses hardcoded styles for performance and reliability.
 * 
 * @param props - Component props including the active boolean state.
 */
export const StatusBadge: React.FC<StatusBadgeProps> = React.memo(({ active }) => (
    <span style={active ? activeStyle : inactiveStyle}>
        {active ? 'Activo' : 'Inactivo'}
    </span>
));
StatusBadge.displayName = 'StatusBadge';
