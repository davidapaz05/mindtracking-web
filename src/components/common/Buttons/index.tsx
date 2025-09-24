import Text from "../Text"

interface propsButton{
  text: string
  secondary?: boolean
  widthClass?: string
}

// Quero passar apenas o text do props
export default function Button(props: propsButton){
  const width = props.widthClass ?? 'w-auto'

  return (
    props.secondary ? (
            // Button secundario
      <button className={`${width} bg-none border-blue-600 border-[3px]
        md:px-17 md:py-3 rounded-3xl transition-all duration-200 lg:mt-8 cursor-pointer
        disabled:opacity-60 disabled:cursor-not-allowed
        active:scale-[0.98] active:brightness-95 active:border-blue-300
        active:drop-shadow-[0_0_15px_rgba(255,255,255,0.7)]
`}>
                    <Text
                      text={props.text}
                      noBlack={false}
                      size="md"
                      align="center"
                      weight="bold"
                    />
            </button>
        ) : (
            // Button primario
      <button className={`${width} bg-blue-600 hover:bg-blue-500 px-10 py-2 md:px-17 md:py-3 rounded-4xl md:rounded-3xl border-4 border-transparent transition-all duration-200 lg:mt-8 cursor-pointer
        disabled:opacity-60 disabled:cursor-not-allowed 
        active:scale-[0.98] active:brightness-95 active:border-blue-700
        active:drop-shadow-[0_0_15px_#0C4A6E]
`}>
                    <Text
                      text={props.text}
                      noBlack={true}
                      size="md"
                      align="center"
                      weight="bold"
                    />
            </button>
        )
    )

  // Como eu uso props dentro de um className?


}