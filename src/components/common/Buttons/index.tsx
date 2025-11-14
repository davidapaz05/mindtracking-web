import Text from "../Text";

interface PropsButton {
  text: string;
  secondary?: boolean;
  widthClass?: string;
  paddingClass?: string;
  mtForSecondary?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  loading?: boolean;
}

export default function Button(props: PropsButton) {
  const width = props.widthClass ?? "w-auto";
  const padding = props.paddingClass ?? "px-10 py-2"; 
  const mtForSecondary = props.mtForSecondary ?? "md:mt-5";

  const baseClasses = `
    ${width} ${padding} transition-all duration-200 ${mtForSecondary} cursor-pointer
    disabled:opacity-60 disabled:cursor-not-allowed
    active:scale-[0.98] active:brightness-95
  `;

  const primaryClasses = `
    ${baseClasses} bg-blue-600 hover:bg-blue-500 md:px-17 md:py-3 
    rounded-4xl md:rounded-3xl border-4 border-transparent
    active:border-blue-700 active:drop-shadow-[0_0_15px_#0C4A6E]
  `;

  const secondaryClasses = `
    ${baseClasses} bg-none border-blue-600 border-[3px] md:px-17 md:py-3 
    rounded-3xl active:border-blue-300
    active:drop-shadow-[0_0_15px_rgba(255,255,255,0.7)]
  `;

  return (
    <button
      className={props.secondary ? secondaryClasses : primaryClasses}
      onClick={props.onClick}
      type={props.type || "button"}
      disabled={props.disabled || props.loading}
    >
      <Text
        text={props.loading ? "Enviando..." : props.text}
        noBlack={!props.secondary}
        size="md"
        align="center"
        weight="bold"
      />
    </button>
  );
}