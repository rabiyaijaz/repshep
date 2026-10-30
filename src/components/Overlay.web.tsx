import { useContext, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Modal, StyleSheet, View } from 'react-native';
import type { OverlayProps } from './Overlay';
import { OverlayHostContext } from './overlayHost';

// Web: portal into the phone mockup's screen when there is one, so sheets stay inside the phone.
export function Overlay({ visible, onRequestClose, animationType = 'fade', children }: OverlayProps) {
  const host = useContext(OverlayHostContext);

  useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onRequestClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [visible, onRequestClose]);

  if (!host) {
    return (
      <Modal visible={visible} transparent animationType={animationType} onRequestClose={onRequestClose}>
        {children}
      </Modal>
    );
  }
  if (!visible) return null;
  return createPortal(<View style={[StyleSheet.absoluteFill, { zIndex: 50 }]}>{children}</View>, host);
}
