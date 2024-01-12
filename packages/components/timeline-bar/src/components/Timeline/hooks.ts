/*
Copyright 2024 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/


import { useLayoutEffect, useState, useRef } from 'react';

export function useWindowSize() {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
}

export function useScrollPosition(effect, element, wait = 100) {
  useRef(element);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let throttleTimeout: any | null = null;

  const callBack = () => {
    effect({ currPos: element.current.scrollLeft });
    throttleTimeout = null;
  };

  useLayoutEffect(() => {
    const handleScroll = () => {
      throttleTimeout = throttleTimeout || setTimeout(callBack, wait);
    };

    element.current.addEventListener('scroll', handleScroll);
    return () => element.current.removeEventListener('scroll', handleScroll);
  }, []);
}

export function useScrollToCentered(position, element, outer) {
  useRef(element);
  useRef(outer);
  useLayoutEffect(() => {
    // if position isn't visible, scroll to it
    const outerWidth = outer.current.clientWidth;
    const currentScroll = element.current.scrollLeft;
    if (position < element.current.scrollLeft || position > currentScroll + outerWidth) {
      // eslint-disable-next-line no-param-reassign
      element.current.scrollLeft = position - outerWidth / 2;
    }
  }, [position]);
}
