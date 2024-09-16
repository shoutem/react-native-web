/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import Swal from 'sweetalert2';

const DEFAULT_CONFIRM_BUTTON = {style: 'confirm', text: 'OK'};

class Alert {
  static alert(title, message, buttons = [DEFAULT_CONFIRM_BUTTON], options = {}) {
    const confirmButton = buttons.find(button => !button.style || button.style === 'confirm')
    const denyButton = buttons.find(button => button.style === 'destructive')
    const cancelButton = buttons.find(button => button.style === 'cancel')

    const resolveButtonClass = (buttonType) => {
      let classes = `alert-${buttonType}`

      if (buttons.length === 3) {
        classes = classes + ' full-width button-height'

        // Cancel button is always the last button in this case and we don't the want border there.
        if (buttonType !== "cancel") {
          classes = classes + ' border-bottom';
        }
      } else if (buttons.length === 2) {
        classes = classes + ' half-width'

        // Cancel button is the last in this case and we want first button to have border-right only.
        if (buttonType === "confirm" || buttonType === 'deny') {
          classes = classes + ' border-right';
        }
      } else {
        classes = classes + ' full-width'
      }

      return classes;
    }

    Swal.fire({
      title,
      text: message,
      animation: false,
      showConfirmButton: true,
      showDenyButton: !!denyButton,
      showCancelButton: !!cancelButton,
      confirmButtonText: confirmButton?.text,
      denyButtonText: denyButton?.text,
      cancelButtonText: cancelButton?.text,
      width: '20em',
      background: '#f7f7f7',
      confirmButtonColor: 'transparent',
      cancelButtonColor: 'transparent',
      denyButtonColor: 'transparent',
      customClass: {
        container: 'alert-container',
        popup: 'alert-popup',
        title: 'alert-title',
        actions: 'alert-actions',
        confirmButton: resolveButtonClass("confirm"),
        cancelButton: resolveButtonClass("cancel"),
        denyButton: resolveButtonClass("deny")
      }
    }).then(result => {
      if (result.isConfirmed) {
        if (confirmButton?.onPress !== undefined) {
          confirmButton.onPress();
        }
      } else if (result.isDenied) {
        if (denyButton?.onPress !== undefined) {
          denyButton.onPress();
        }
      } else if (result.isDismissed) {
        // Android Alert supports onDismiss callback. It is preferred over cancel button onPress.
        if (options.onDismiss !== undefined) {
          options.onDismiss();
          return;
        }
        
        if (cancelButton?.onPress !== undefined) {
          cancelButton.onPress();
        }
      }
    });
  }
}

export default Alert;
