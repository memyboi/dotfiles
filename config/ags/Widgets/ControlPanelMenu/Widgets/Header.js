const battery = await Service.import('battery')
const hyprland = await Service.import("hyprland")

let window = "controlpanelmenu";
let settingsPanelCommand = "XDG_CURRENT_DESKTOP=gnome gnome-control-center";

let logoutCommand = "~/.config/wlogout/run.sh"

const icons = {
    100: "\udb80\udc79",
    90: "\udb80\udc82",
    80: "\udb80\udc81",
    70: "\udb80\udc80",
    60: "\udb80\udc7f",
    50: "\udb80\udc7e",
    40: "\udb80\udc7d",
    30: "\udb80\udc7c",
    20: "\udb80\udc7b",
    10: "\udb80\udc7a",
    0: "\uf244",
}

function getBatteryIcon(p) {
    const icon = [100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 0].find(
        threshold => threshold <= p)
    
    return `${icons[icon]}`
}

export function Header() {
    return Widget.Box({
        class_name: "controlpanelheader",
        width_request: 400,
        hexpand: true,
        vpack: "center",
        children: [
            Widget.Box({
                css: `min-width: 80px;
                min-height: 80px;
                background-image: url("/home/${Utils.USER}/.config/ags/avatar.png");
                background-size: cover;
                border-radius: 17.5px;`
            }),
            Widget.Box({
                vpack: "center",
                vertical: true,
                hpack: "start",
                children: [
                    Widget.Label({
                        margin_left: 15,
                        label: `Hey there, ${Utils.USER}!`,
                        css: `font-size: 20px`,
                        margin_right: 10
                    }),
                    Widget.Box({
                        margin_left: 15,
                        margin_right: 10,
                        visible: battery.bind('available'),
                        children: [
                            Widget.Icon({
                                icon: battery.bind("icon_name"),
                                css: `font-size: 16px`,
                                class_name: "arch-flex",
                            }),
                            Widget.Label({
                                class_name: "arch-flex",
                                css: `font-size: 16px`,
                                label: battery.bind('percent').as(p => p > 0 ? `${p}%` : `0%`),
                                // class_name: battery.bind('charging').as(ch => ch ? 'charging' : ''),
                            })
                        ]
                    })
                ]
            }),
            Widget.Box({hexpand: true}),
            Widget.Box({
                margin_right: 5,
                spacing: 12,
                children: [
                    Widget.EventBox({
                        onPrimaryClick: () => {
                            App.toggleWindow(window);
                            if (hyprland.active) {
                                // it is written like this because of ags deciding to spawn gnome-control-center on workspace 1
                                hyprland.messageAsync(`dispatch exec ${settingsPanelCommand}`)
                            } else {
                                Utils.execAsync(`bash -c "${settingsPanelCommand}"`);
                            }
                        },
                        child: Widget.Label({
                            class_name: "arch-flex",
                            label: "\ueb51",
                            css: "font-size: 20px",
                        })
                    }),
                    Widget.EventBox({
                        onPrimaryClick: () => {
                            App.toggleWindow(window);
                            Utils.execAsync(`bash -c "${logoutCommand}"`);
                        },
                        child: Widget.Label({
                            class_name: "arch-flex",
                            label: "\udb82\udd06",
                            css: "font-size: 20px",
                        })
                    })
                ]
            })
        ],
    })
}
