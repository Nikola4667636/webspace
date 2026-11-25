import type { ButtonHTMLAttributes } from "react";
import styles from "./Button.module.css";

export function buttonClass(secondary = false, small = false): string {
  return [styles.button, secondary ? styles.secondary : "", small ? styles.small : ""].filter(Boolean).join(" ");
}

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  secondary?: boolean;
  small?: boolean;
}

export default function Button({ secondary, small, type = "button", className, ...rest }: Props) {
  return <button type={type} className={[buttonClass(secondary, small), className].filter(Boolean).join(" ")} {...rest} />;
}
