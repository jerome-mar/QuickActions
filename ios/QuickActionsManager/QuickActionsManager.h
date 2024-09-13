//
//  QuickActionsManager.h
//  QuickActions
//
//  Created by Hiếu Dương Thanh on 13/9/24.
//

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface QuickActionsManager : RCTEventEmitter <RCTBridgeModule>

+ (void)onQuickActionPress:(UIApplicationShortcutItem *)shortcutItem;

@end
