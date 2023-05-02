import { appStateProps } from "./app"
import { subtitleStateProps } from "./subtitle"

export interface storeProps {
  app : appStateProps
  subtitle: subtitleStateProps
}