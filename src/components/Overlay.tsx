import type { ReactNode } from 'react';
import { Modal } from 'react-native';

export type OverlayProps = {
  visible: boolean;
  onRequestClose: () => void;
  animationType?: 'slide' | 'fade';
  children: ReactNode;
};

// Native: a plain transparent Modal. Web uses Overlay.web.tsx.
export function Overlay({ visible, onRequestClose, animationType = 'fade', children }: OverlayProps) {
  return (
    <Modal visible={visible} transparent animationType={animationType} onRequestClose={onRequestClose}>
      {children}
    </Modal>
  );
}
