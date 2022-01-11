import React, {useState, useEffect,useCallback } from 'react';
import styles  from './index.less';

function Index(props) {
  const {children,location} = props;
  return (
    <div style={{height:'100%'}}>
     {children}
    </div>
  );
}

export default Index;
