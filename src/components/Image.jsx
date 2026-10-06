import React from 'react';
export const Image = ({ src, alt = '', width, height, fill, priority, quality, className, style, ...props }) => {
    const imgSrc = typeof src === 'string' ? src : src?.src || src;
    const combinedStyle = {
        ...(fill ? { width: '100%', height: '100%', objectFit: 'cover' } : {}),
        ...style,
    };
    return (<img src={imgSrc} alt={alt} width={fill ? undefined : width} height={fill ? undefined : height} className={className} style={combinedStyle} {...props}/>);
};
export default Image;
