import { MenuBuilder, type MenuItemConfig } from '@menu/index'
import { KeyRound } from 'lucide-vue-next'

export class KeywordMenuBuilder extends MenuBuilder {
  build(menu: MenuItemConfig, menuName: string): MenuItemConfig {
    if (menuName === 'admin') {
      return this.buildMainMenu(menu)
    }

    return menu
  }

  private buildMainMenu(menu: MenuItemConfig): MenuItemConfig {
    this.addMenuItem(menu, {
      id: 'keyword-keywords',
      title: 'Kulcsszavak',
      path: '/admin/keyword',
      icon: KeyRound,
      order: 36,
      permission: 'keyword',
    })

    return menu
  }
}

export const keywordMenuBuilder = new KeywordMenuBuilder()
