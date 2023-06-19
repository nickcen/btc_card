import { Inscription } from 'srcPath/services/ord'

type InscriptionViewProps = {
  inscription: Inscription
} & React.ImgHTMLAttributes<HTMLImageElement> &
  React.IframeHTMLAttributes<HTMLIFrameElement>
const InscriptionView: React.FC<InscriptionViewProps> = (props) => {
  const { inscription, ...resProps } = props
  return (
    <>
      {/(image|svg)/.test(inscription.detail?.content_type ?? '') ? (
        <a
          className="relative"
          href={inscription.detail?.preview.replace('preview', 'inscription')}
          target="_blank"
        >
          <div
            className="absolute w-full h-full z-10"
            onClick={() => {
              window.open(
                inscription.detail?.preview.replace('preview', 'inscription')
              )
            }}
          ></div>
          <iframe
            {...resProps}
            src={inscription.detail?.preview}
            sandbox="allow-scripts"
            scrolling="no"
            loading="lazy"
          />
        </a>
      ) : (
        // <img {...resProps} src={inscription.detail?.preview} alt="" />
        // <iframe {...resProps} src={inscription.detail?.preview} sandbox="allow-scripts" scrolling="no" loading="lazy" />
        <a
          className="relative"
          href={inscription.detail?.preview.replace('preview', 'inscription')}
          target="_blank"
        >
          <div
            className="absolute w-full h-full z-10"
            onClick={() => {
              window.open(
                inscription.detail?.preview.replace('preview', 'inscription')
              )
            }}
          ></div>
          <iframe
            {...resProps}
            src={inscription.detail?.preview}
            sandbox="allow-scripts"
            scrolling="no"
            loading="lazy"
          />
        </a>
      )}
    </>
  )
}

export default InscriptionView
