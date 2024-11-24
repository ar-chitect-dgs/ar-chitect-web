import React, { ReactNode } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import './ScrollBar.css';

type ScrollBarProps = {
  className?: string;
  children?: ReactNode;
};

const ScrollBar = ({
  children,
  className = '',
}: ScrollBarProps): JSX.Element => (
  <Scrollbars
    className={className}
    renderTrackHorizontal={() => <div className="scroll-track-horizontal" />}
    renderThumbVertical={(props) => (
      <div
        {...props}
        className="scroll-thumb-vertical"
      />
    )}
    renderTrackVertical={(props) => (
      <div
        {...props}
        className="scroll-track-vertical"
      />
    )}
  >
    {children}
  </Scrollbars>
);

export default ScrollBar;
