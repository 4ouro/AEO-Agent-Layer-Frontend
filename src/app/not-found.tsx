import { MessagePage } from '@/components/layout/message-page';
import { ButtonLink } from '@/components/ui/button';

export default function NotFound() {
  return (
    <MessagePage title="This page does not exist.">
      <ButtonLink href="/">Scan a site</ButtonLink>
    </MessagePage>
  );
}
