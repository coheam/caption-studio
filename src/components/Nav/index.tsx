import { useDispatch } from "react-redux"
import Link from "next/link"
import useTranslation from "next-translate/useTranslation"
import { initialSubtitle } from "@/store/subtitle/actions"

type menuItem = {
  id: string
  text: string
  type: "action" | "dialog" | "link"
  icon: string
  target?: string
  action?: Function
}
type sling = {
  menu: menuItem[]
}


const Nav = () => {
  const dispatch = useDispatch()
  const sling = {
    "menu" : [
      { id: "new-file", text: "new-file", type: "action", target: "", icon: "draft", action: () => {
        dispatch(initialSubtitle())
      } },
      { id: "import-video", text: "import-video", type: "action", icon: "video_call", action: () => {} },
      { id: "import-subtitle", text: "import-subtitle", type: "action", icon: "subtitles", action: () => {} },
      { id: "export-subtitle", text: "export-subtitle", type: "action", icon: "download", action: () => {} },
      { id: "cs-setting", text: "cs-setting", type: "action", icon: "settings", action: () => {} },
      { id: "cs-manual", text: "cs-manual", type: "link", icon: "help_center", target: "/manual" }
    ]
  }
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
                  <button type="button" className="anchor" onClick={item.action}>
                    <span className="icon material-symbols-rounded">{item.icon}</span>
                    <span className="text">{t(item.text)}</span>
                  </button>
                )}
                {(item.type === 'link') && (
                  <Link href={item.target as string} className="anchor">
                    <span className="icon material-symbols-rounded">{item.icon}</span>
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