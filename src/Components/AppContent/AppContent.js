import React from 'react';
import styles from './AppContent.module.css';

export default function AppContent({ children }) {
  return <div className={styles.appContent}>{children}</div>;
}
