import { Problem } from "@seij/common-types";
import {
  Link,
  Toast,
  ToastBody,
  Toaster,
  ToastTitle,
  ToastTrigger,
  useToastController,
} from "@fluentui/react-components";

const toasterId = "toaster-error-manager";

export function ErrorManager() {
  return <Toaster toasterId={toasterId} position="top" pauseOnWindowBlur={true} pauseOnHover={true} />;
}

export const useErrorNotifier = () => {
  const { dispatchToast } = useToastController(toasterId);
  const errorNotification = (error: Problem | null | undefined) => {
    if (!error) return;
    dispatchToast(
      <Toast appearance="inverted">
        <ToastTitle
          action={
            <ToastTrigger>
              <Link>OK</Link>
            </ToastTrigger>
          }
        >
          {error.title}
        </ToastTitle>
        <ToastBody>{error.detail}</ToastBody>
      </Toast>,
      { intent: "error", timeout: 60_000, position: "top" },
    );
  };
  return { errorNotifier: errorNotification };
};
