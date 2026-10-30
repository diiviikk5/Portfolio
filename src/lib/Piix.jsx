import React, { useLayoutEffect, useRef } from 'react';

/* Piixpal elements read plain attributes when they connect. React 19 would try to set some of
   them as properties (piix-type's `text` is a getter), so make the element ourselves and slot
   it in right where this component sits, inside the real parent. */
export default function Piix({ tag = 'piix-pal', elRef, events, ...attrs }) {
  const ph = useRef(null);
  const key = JSON.stringify(attrs);
  useLayoutEffect(() => {
    const el = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => v != null && v !== false && el.setAttribute(k === 'className' ? 'class' : k, v === true ? '' : String(v)));
    // listeners go on before the element connects, so a `piix:ready` fired on connect isn't missed
    Object.entries(events || {}).forEach(([type, fn]) => el.addEventListener(type, fn));
    ph.current.parentNode.insertBefore(el, ph.current);
    if (elRef) elRef.current = el;
    return () => { el.remove(); if (elRef) elRef.current = null; };
  }, [tag, key]);
  return <span ref={ph} hidden />;
}
