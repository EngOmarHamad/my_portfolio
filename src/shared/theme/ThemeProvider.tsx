import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { App, ConfigProvider, theme as antdTheme } from 'antd'
import type { ThemeConfig } from 'antd'
import enUS from 'antd/locale/en_US'
import arEG from 'antd/locale/ar_EG'
import { useLanguage } from '@/shared/i18n'
import { useTheme } from '@/portfolio/hooks/useTheme'
import { bindMessageApi } from '@/shared/lib/toast'
import { BRAND, FONT_SANS, palette } from './tokens'

function buildThemeConfig(isDark: boolean): ThemeConfig {
  const p = isDark ? palette.dark : palette.light
  const layoutBg = isDark ? p.bg : '#F4F7FB'
  const containerBg = isDark ? p.surface : '#FFFFFF'
  const siderBg = isDark ? p.surface : '#FFFFFF'

  return {
    algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
    token: {
      colorPrimary: p.primary,
      colorLink: isDark ? p.primaryLight : p.primary,
      colorLinkHover: isDark ? p.secondaryLight : p.secondary,
      colorInfo: p.info,
      colorSuccess: p.success,
      colorWarning: p.warning,
      colorError: p.error,
      colorBgBase: isDark ? p.bg : '#F7FAFF',
      colorBgLayout: layoutBg,
      colorTextBase: p.text,
      colorTextSecondary: p.textSecondary,
      colorTextTertiary: p.textTertiary,
      colorBorder: p.border,
      colorBorderSecondary: p.borderLight,
      colorBgContainer: containerBg,
      colorBgElevated: p.surfaceElevated,
      borderRadius: 10,
      controlHeight: 36,
      fontFamily: FONT_SANS,
      fontSize: 14,
      lineWidth: 1,
      boxShadowSecondary: p.shadowElevated,
    },
    components: {
      Layout: {
        siderBg,
        headerBg: containerBg,
        headerHeight: 68,
        headerPadding: '0 24px',
        bodyBg: layoutBg,
        triggerBg: isDark ? '#162033' : '#F8FAFC',
        triggerColor: isDark ? '#E5EDF8' : '#475569',
      },
      Menu: {
        itemBorderRadius: 10,
        itemMarginInline: 8,
        itemMarginBlock: 2,
        itemHeight: 40,
        subMenuItemBorderRadius: 10,
        groupTitleFontSize: 11,
        groupTitleLineHeight: '18px',
        iconSize: 16,
        collapsedIconSize: 18,
        itemBg: 'transparent',
        subMenuItemBg: 'transparent',
        itemColor: isDark ? '#94A3B8' : '#475569',
        itemHoverColor: isDark ? '#F8FAFC' : '#0F172A',
        itemHoverBg: isDark ? 'rgba(148, 163, 184, 0.1)' : '#F1F5F9',
        itemSelectedBg: isDark ? 'rgba(79, 142, 247, 0.16)' : 'rgba(25, 53, 75, 0.08)',
        itemSelectedColor: isDark ? '#EAF2FF' : BRAND.navy,
        itemActiveBg: isDark ? 'rgba(148, 163, 184, 0.12)' : '#EEF2F7',
        groupTitleColor: isDark ? '#64748B' : '#94A3B8',
        activeBarBorderWidth: 0,
      },
      Button: {
        borderRadius: 5,
        borderRadiusLG: 6,
        borderRadiusSM: 4,
        primaryShadow: 'none',
        defaultShadow: 'none',
        dangerShadow: 'none',
        fontWeight: 500,
        controlHeight: 34,
        controlHeightLG: 40,
        controlHeightSM: 28,
        paddingInline: 15,
        paddingInlineLG: 19,
        paddingInlineSM: 11,
      },
      Input: {
        borderRadius: 6,
        borderRadiusLG: 6,
        borderRadiusSM: 4,
        activeShadow: 'none',
        paddingBlock: 7,
        paddingInline: 12,
      },
      InputNumber: { borderRadius: 6, activeShadow: 'none' },
      Select: {
        borderRadius: 6,
        optionSelectedBg: isDark ? p.surfaceHover : 'rgba(22, 140, 131, 0.08)',
        optionActiveBg: isDark ? p.surfaceHover : p.surfaceHover,
      },
      DatePicker: { borderRadius: 6, activeShadow: 'none' },
      Card: {
        borderRadiusLG: 8,
        headerFontSize: 15,
        headerFontSizeSM: 14,
        paddingLG: 20,
        boxShadowTertiary: p.shadowCard,
        colorBorderSecondary: p.border,
      },
      Table: {
        headerBg: isDark ? p.surfaceElevated : '#F8FAFD',
        headerColor: p.textSecondary,
        headerSplitColor: 'transparent',
        borderColor: p.borderLight,
        rowHoverBg: isDark ? 'rgba(148, 163, 184, 0.08)' : '#F8FAFC',
        rowSelectedBg: isDark ? 'rgba(96, 165, 250, 0.14)' : 'rgba(37, 99, 235, 0.06)',
        rowSelectedHoverBg: isDark ? 'rgba(96, 165, 250, 0.18)' : 'rgba(37, 99, 235, 0.08)',
        headerBorderRadius: 12,
        cellPaddingBlock: 14,
        cellPaddingInline: 16,
        cellPaddingBlockMD: 12,
        cellPaddingInlineMD: 14,
        cellPaddingBlockSM: 10,
        cellPaddingInlineSM: 12,
        cellFontSize: 14,
        headerSortActiveBg: isDark ? p.surfaceHover : '#F1F5F9',
        headerSortHoverBg: isDark ? p.surfaceHover : '#F1F5F9',
        fixedHeaderSortActiveBg: isDark ? p.surfaceHover : '#F1F5F9',
        bodySortBg: 'transparent',
        footerBg: 'transparent',
      },
      Modal: {
        borderRadiusLG: 8,
        titleFontSize: 16,
        headerBg: 'transparent',
      },
      Drawer: { borderRadiusLG: 10 },
      Tag: { borderRadiusSM: 4, defaultBg: isDark ? p.surfaceElevated : '#F2F4F7' },
      Popconfirm: { borderRadiusLG: 8 },
      Message: { borderRadiusLG: 8, contentPadding: '10px 16px' },
      Notification: { borderRadiusLG: 8 },
      Dropdown: { borderRadiusLG: 8, paddingBlock: 8 },
      Segmented: { borderRadius: 6, itemSelectedBg: isDark ? p.surfaceElevated : '#FFFFFF' },
      Tabs: { itemSelectedColor: isDark ? p.primaryLight : BRAND.navy, inkBarColor: isDark ? p.primaryLight : BRAND.navy },
      Timeline: { tailColor: p.border },
      Tooltip: { borderRadius: 6 },
      Popover: { borderRadiusLG: 8 },
      Upload: { borderRadiusLG: 6 },
      Alert: { borderRadiusLG: 8 },
      Badge: { indicatorHeightSM: 8 },
      FloatButton: { borderRadiusLG: 10 },
      Collapse: { borderRadiusLG: 8, headerBg: 'transparent' },
      Result: { iconFontSize: 60 },
      List: { itemPaddingLG: '14px 0' },
      Empty: {},
      Skeleton: {},
      Switch: {},
      Checkbox: { borderRadiusSM: 4 },
      Radio: {},
      Breadcrumb: { itemColor: p.textSecondary, lastItemColor: p.text, linkColor: p.textTertiary, linkHoverColor: p.primaryLight },
      Pagination: {
        itemActiveBg: isDark ? 'rgba(79, 142, 247, 0.18)' : 'rgba(25, 53, 75, 0.08)',
        itemActiveColorDisabled: isDark ? '#94A3B8' : '#94A3B8',
        itemBg: 'transparent',
        itemInputBg: containerBg,
        borderRadius: 8,
        itemSize: 32,
      },
      Progress: {},
      Statistic: {},
      Tree: {},
      Carousel: {},
      Anchor: {},
      Cascader: { borderRadius: 6 },
      Slider: {},
      Rate: {},
      Divider: { colorSplit: p.border },
    },
  }
}

function ToastBridge() {
  const { message } = App.useApp()
  useEffect(() => {
    bindMessageApi(message)
  }, [message])
  return null
}

interface ThemeProviderProps {
  children: ReactNode
}

/**
 * Wraps the app in Ant Design's ConfigProvider:
 * — two-color brand theme (navy + teal) with the global palette
 * — dark/light algorithm driven by the existing theme store
 * — RTL + locale driven by the existing language store
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  const { lang } = useLanguage()
  const { isDark } = useTheme()

  return (
    <ConfigProvider
      direction={lang === 'ar' ? 'rtl' : 'ltr'}
      locale={lang === 'ar' ? arEG : enUS}
      theme={buildThemeConfig(isDark)}
      componentSize="middle"
    >
      <App>
        <ToastBridge />
        {children}
      </App>
    </ConfigProvider>
  )
}
