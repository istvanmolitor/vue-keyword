import { MenuBuilder, type MenuItemConfig } from '@menu/index'
import { KeyRound, Tags } from 'lucide-vue-next'

export class KeywordMenuBuilder extends MenuBuilder {
  build(menu: MenuItemConfig, menuName: string): MenuItemConfig {
    if (menuName === 'admin') {
      return this.buildMainMenu(menu)
    }

    return menu
  }

  private buildMainMenu(menu: MenuItemConfig): MenuItemConfig {
    this.addMenuItem(menu, {
      id: 'keyword-management',
      title: 'Kulcsszavak',
      icon: KeyRound,
      order: 36,
      permission: 'keyword',
      children: [
        {
          id: 'keyword-keywords',
          title: 'Kulcsszavak',
          path: '/admin/keyword',
          icon: KeyRound,
          order: 10,
          permission: 'keyword',
        },
        {
          id: 'keyword-keyword-groups',
          title: 'Csoportok',
          path: '/admin/keyword-group',
          icon: Tags,
          order: 20,
          permission: 'keyword',
        },
      ],
    })

    return menu
  }
}

export const keywordMenuBuilder = new KeywordMenuBuilder()
