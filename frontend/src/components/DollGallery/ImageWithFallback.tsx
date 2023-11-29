import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const ImageWithFallback = (props: any) => {
    const { src, fallbackSrc, ...rest } = props;
    const [imgSrc, setImgSrc] = useState(src);

    useEffect(() => {
        setImgSrc(src);
    }, [src]);

    return (
        <Image
            {...rest}
            src={imgSrc}
            className='rounded-lg absolute w-full h-full bg-white'
            onError={() => {
                setImgSrc(fallbackSrc);
            }}
        />
    );
};

export default ImageWithFallback;