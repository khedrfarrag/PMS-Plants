import { ComponentProps, forwardRef, ReactNode } from "react";
type TextFeildProps = {
  label: string;
  error: string | undefined;
  starticon?: ReactNode;
} & ComponentProps<"input">;
const TextFeild = forwardRef<HTMLInputElement, TextFeildProps>(
  ({ error, label, starticon, ...props }, ref) => {
    return (
      <>
        <div className="w-100 d-flex flex-column ">
          <label htmlFor="email">{label}</label>
          <div className="position-relative">
            <input className="w-100 p-2" {...props} ref={ref} />
            {error && <span className="text-danger">{error}</span>}
            {/* using icons */}
            {starticon && (
              <div className="position-absolute top-0 p-3 start-0  ">
                {starticon}
              </div>
            )}
          </div>
        </div>{" "}
      </>
    );
  }
);

export default TextFeild;
