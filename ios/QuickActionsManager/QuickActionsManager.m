//
//  QuickActionsManager.m
//  QuickActions
//
//  Created by Hiếu Dương Thanh on 13/9/24.
//

#import "QuickActionsManager.h"

@implementation QuickActionsManager

RCT_EXPORT_MODULE();

static QuickActionsManager *sharedInstance = nil;

+ (id)allocWithZone:(NSZone *)zone {
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    sharedInstance = [super allocWithZone:zone];
  });
  return sharedInstance;
}

+ (QuickActionsManager *)sharedInstance {
  return sharedInstance;
}

- (NSArray<NSString *> *)supportedEvents {
  return @[@"QuickAction"];
}

+ (void)onQuickActionPress:(UIApplicationShortcutItem *)shortcutItem {
  if (sharedInstance != nil) {
    [sharedInstance sendEventWithName:@"QuickAction" body:@{@"type": shortcutItem.type}];
  }
}

RCT_EXPORT_METHOD(setQuickActions:(NSArray *)actions) {
  NSMutableArray *shortcutItems = [NSMutableArray new];

  for (NSDictionary *action in actions) {
    NSString *type = action[@"type"];
    NSString *title = action[@"title"];
    NSString *subtitle = action[@"subtitle"];
    NSString *iconType = action[@"iconType"];

    UIApplicationShortcutIcon *icon = [UIApplicationShortcutIcon iconWithType:UIApplicationShortcutIconTypeCompose];
    if (iconType) {
      NSInteger iconTypeValue = [iconType integerValue];
      icon = [UIApplicationShortcutIcon iconWithType:iconTypeValue];
    }

    UIApplicationShortcutItem *item = [[UIApplicationShortcutItem alloc] initWithType:type
                                                                      localizedTitle:title
                                                                   localizedSubtitle:subtitle
                                                                                icon:icon
                                                                            userInfo:nil];

    [shortcutItems addObject:item];
  }

  [[UIApplication sharedApplication] setShortcutItems:shortcutItems];
}

RCT_EXPORT_METHOD(removeAllQuickActions) {
  [[UIApplication sharedApplication] setShortcutItems:@[]];
}

@end
