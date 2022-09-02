import { Component } from "react"
import { ScrollbarProps, Scrollbars } from "react-custom-scrollbars-2"

/** */
export default class ScrollBox extends Component<ScrollbarProps> {
    render(): React.ReactNode {
        return <Scrollbars {...this.props} />
    }
}
