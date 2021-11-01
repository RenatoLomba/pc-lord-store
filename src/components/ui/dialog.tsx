import React, { FC, MutableRefObject } from 'react';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react';
import { Btn } from './btn';

type DialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const Dialog: FC<DialogProps> = ({ isOpen, onClose, onConfirm }) => {
  const cancelRef =
    React.useRef<HTMLButtonElement>() as MutableRefObject<HTMLButtonElement>;

  return (
    <>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Deletar Produto
            </AlertDialogHeader>

            <AlertDialogBody>
              Você tem certeza que deseja deletar este produto do sistema?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Btn buttonStyle="secondary" ref={cancelRef} onClick={onClose}>
                Cancelar
              </Btn>
              <Btn colorScheme="red" onClick={onConfirm} ml={3}>
                Sim
              </Btn>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export { Dialog };
