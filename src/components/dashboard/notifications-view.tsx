
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { notificationsData } from '@/lib/data';
import type { Notification } from '@/lib/definitions';
import { formatDistanceToNow } from 'date-fns';
import { Bell, CheckCheck, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/language-context';

export function NotificationsView() {
    const [notifications, setNotifications] = useState<Notification[]>(notificationsData);
    const { t } = useLanguage();

    const toggleReadStatus = (id: string) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, read: !n.read } : n));
    };

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    }

    const deleteAllNotifications = () => {
        setNotifications([]);
    }

    const getBadgeVariant = (type: Notification['type']): 'default' | 'secondary' | 'destructive' | 'outline' => {
        switch (type) {
            case 'Goal Reached':
                return 'default';
            case 'Committee Payout':
                return 'default';
            case 'Budget Alert':
                return 'destructive';
            case 'New Article':
                return 'secondary';
            default:
                return 'secondary';
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">{t('notifications.title')}</h1>
                    <p className="text-muted-foreground">{t('notifications.description')}</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={markAllAsRead} disabled={notifications.every(n => n.read)}>
                        <CheckCheck className="me-2 h-4 w-4" /> {t('notifications.markAllRead')}
                    </Button>
                     <Button variant="destructive" onClick={deleteAllNotifications} disabled={notifications.length === 0}>
                        <Trash2 className="me-2 h-4 w-4" /> {t('notifications.deleteAll')}
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{t('notifications.allNotifications')}</CardTitle>
                </CardHeader>
                <CardContent>
                    {notifications.length === 0 ? (
                         <div className="text-center py-12 text-muted-foreground">
                            <Bell className="mx-auto h-12 w-12 mb-4" />
                            <p className="font-semibold">{t('notifications.noNotificationsTitle')}</p>
                            <p className="text-sm">{t('notifications.noNotificationsDescription')}</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {notifications.map(notification => (
                                <div 
                                    key={notification.id} 
                                    className={cn(
                                        "flex items-start gap-4 p-4 rounded-lg border transition-colors cursor-pointer",
                                        notification.read ? 'bg-background hover:bg-muted/50' : 'bg-card'
                                    )}
                                    onClick={() => toggleReadStatus(notification.id)}
                                >
                                    <div className={cn("flex-shrink-0 w-2 h-2 mt-2.5 rounded-full", notification.read ? 'bg-transparent' : 'bg-primary')} />
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <Badge variant={getBadgeVariant(notification.type)}>{notification.type}</Badge>
                                            <p className="text-xs text-muted-foreground">
                                                {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                                            </p>
                                        </div>
                                        <p className={cn("mt-1", notification.read ? 'text-muted-foreground font-normal' : 'text-foreground font-semibold')}>
                                            {notification.message}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
