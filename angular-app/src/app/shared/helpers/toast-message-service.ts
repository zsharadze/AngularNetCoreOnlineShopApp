import { ToastrService } from 'ngx-toastr';

export const showToastMessage = (
  toastrService: ToastrService,//passing service object here cause in some places ToastrService can't be injected
  title: string,
  message: string,
  showAsError: boolean = false,
  timeOut: number = 8000,
  tapToDismiss: boolean = true,
  extendedTimeOut: number = 0,
  enableHtml: boolean = true
) => {
  if (showAsError)
    toastrService.error(message, title, {
      timeOut: timeOut,
      tapToDismiss: tapToDismiss,
      extendedTimeOut: extendedTimeOut,
      enableHtml: enableHtml,
      closeButton: true,
    });
  else {
    toastrService.success(message, title, {
      timeOut: timeOut,
      tapToDismiss: tapToDismiss,
      extendedTimeOut: extendedTimeOut,
      enableHtml: enableHtml,
      closeButton: true,
    });
  }
};

export const showProductAddedToShoppingCart = (
  toastrService: ToastrService
) => {
  showToastMessage(
    toastrService,
    'Info',
    'Product added to shopping cart',
    false,
    3000
  );
};

export const clearToastMessages = (toastrService: ToastrService) => {
  toastrService.clear();
};
