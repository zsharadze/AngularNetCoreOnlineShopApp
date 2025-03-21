import { ToastrService } from 'ngx-toastr';
import { showToastMessage } from './toast-message-service';

export const showHttpErrorsInToast = (toastrService: ToastrService, e: any) => {
  let errors = '';
  if (e.error) {
    if (e.error.errors) {
      e.error.errors.forEach((err: any) => {
        errors += err + '<br/>';
      });
    }
    Object.keys(e.error).forEach((innerObj: any) => {
      e.error[innerObj]?.errors?.forEach((el: any) => {
        errors += el?.errorMessage + '<br/>';
      });
    });
  }
  if (typeof e.error === 'string') {
    errors += e.error + '<br/>';
  }
  if (e.status === 401) {
    errors += 'Unauthorized';
  }

  showToastMessage(
    toastrService,
    'Error',
    e.message + '<br/>' + errors,
    true,
    8000,
    true,
    0,
    true
  );
};
