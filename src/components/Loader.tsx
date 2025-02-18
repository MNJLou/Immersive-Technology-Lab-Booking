import React, { useEffect } from 'react';
import { loaderProps } from "../../libs/interfaces";
import type { ring2 } from 'ldrs'


export default function Loader({ size, color }: loaderProps) {
    useEffect(() => {
        async function getLoader() {
            const { ring2 } = await import('ldrs')
            ring2.register()
        }
        getLoader()
    }, [])
    return <div
    dangerouslySetInnerHTML={{
      __html: `<l-ring-2 size="${size}" stroke="3" stroke-length="0.25" bg-opacity="0.1" speed="0.8" color="${color}"></l-ring-2>`,
    }}
  />
}