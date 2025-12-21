import React, { ReactNode } from 'react';
import { arePropsEqual, type ComponentProps } from './utils';
import './index.css';

export type TProps = ComponentProps;

const YourComponent = React.memo(({
    children,
    title = 'Default Title',
    className = 'your-component-container',
    disabled = false,
    onClick
}: TProps) => {
    const handleClick = () => {
        if (!disabled && onClick) {
            onClick();
        }
    };

    return React.createElement(
        'div',
        {
            className: `${className} ${disabled ? 'disabled' : ''}`,
            onClick: handleClick
        },
        title && React.createElement('h2', { className: 'component-title' }, title),
        children
    );
}, arePropsEqual);

YourComponent.displayName = 'YourComponent';

export default YourComponent;