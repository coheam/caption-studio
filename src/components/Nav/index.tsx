import useTranslation from "next-translate/useTranslation"
import Link from "next/link"

type menuItem = {
  id: string
  text: string
  type: "action" | "dialog" | "link"
  target: string
}
type sling = {
  menu: menuItem[]
}

const sling = {
  "menu" : [
    { "id": "new-file", "text": "new-file", "type": "action", "target": "" },
    { "id": "import-video", "text": "import-video", "type": "dialog", "target": "import-video" },
    { "id": "import-subtitle", "text": "import-subtitle", "type": "dialog", "target": "import-subtitle" },
    { "id": "export-subtitle", "text": "export-subtitle", "type": "dialog", "target": "export-subtitle" },
    { "id": "cs-setting", "text": "cs-setting", "type": "dialog", "target": "cs-setting" },
    { "id": "cs-manual", "text": "cs-manual", "type": "link", "target": "/manual" }
  ]
}

const Nav = () => {
  const { menu } = sling
  const { t } = useTranslation("app")
  return (
    <div id="nav">
      <h2 className="none">menu</h2>
      <div className="group tcp">
        <ul className="util">
          {menu.map((item) => {
            return (
              <li key={item.id}>
                {(item.type === 'action') && (
                  <Link href="/" className="anchor">
                    <span className="text">{t(item.text)}</span>
                  </Link>
                )}
                {(item.type === 'dialog') && (
                  <a href="#" className="anchor">
                    <span className="text">{t(item.text)}</span>
                  </a>
                )}
                {(item.type === 'link') && (
                  <Link href={item.target} className="anchor">
                    <span className="text">{t(item.text)}</span>
                  </Link>
                )}

              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
export default Nav