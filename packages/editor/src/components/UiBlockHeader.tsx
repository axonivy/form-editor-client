import { Flex } from '@axonivy/ui-components';
import './UiBlockHeader.css';

type UiBlockHeaderProps = {
  visible: string;
  label?: string;
  required?: string;
  disabled?: string;
  additionalInfo?: string;
};

export const UiBlockHeader = ({ visible, label, required, disabled, additionalInfo }: UiBlockHeaderProps) => (
  <Flex direction='row' justifyContent='space-between' alignItems='center' style={{ paddingBottom: '3px' }} className='header-block__label'>
    <span>
      {label}
      {required && required !== 'false' ? (required === 'false' ? '' : ' *') : ''}
    </span>
    <Flex alignItems='center' gap={1} className='header-block__indicators'>
      {additionalInfo && additionalInfo.length === 0 ? null : <span style={{ color: 'var(--N600)' }}>{additionalInfo}</span>}
      <UiBlockHeaderDisablePart disabled={disabled} />
      <UiBlockHeaderVisiblePart visible={visible} />
    </Flex>
  </Flex>
);

export const UiBlockHeaderVisiblePart = ({ visible }: { visible: string }) =>
  visible === 'true' || visible.length === 0 ? null : (
    <svg width='10px' height='10px' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg' className='header-block__visible'>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M10.6484 10.5264L13.4743 13.3523C13.8012 12.9962 14.0007 12.5214 14.0007 12C14.0007 10.8954 13.1053 10 12.0007 10C11.4793 10 11.0045 10.1995 10.6484 10.5264Z'
        fill='#a3a3a3'
      />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M14.1211 18.2422C13.4438 18.4051 12.7343 18.5 12.0003 18.5C9.7455 18.5 7.72278 17.6047 6.14832 16.592C4.56791 15.5755 3.3674 14.3948 2.73665 13.7147C2.11883 13.0485 2.06103 12.0457 2.6185 11.3145C3.05443 10.7428 3.80513 9.84641 4.83105 8.95209L6.24907 10.3701C5.35765 11.1309 4.68694 11.911 4.2791 12.436C4.86146 13.0547 5.90058 14.0547 7.23022 14.9099C8.62577 15.8075 10.2703 16.5 12.0003 16.5C12.1235 16.5 12.2463 16.4965 12.3686 16.4896L14.1211 18.2422ZM15.6656 15.544L17.1427 17.0211C17.3881 16.8821 17.6248 16.7383 17.8522 16.592C19.4326 15.5755 20.6332 14.3948 21.2639 13.7147C21.8817 13.0485 21.9395 12.0457 21.3821 11.3145C20.809 10.563 19.6922 9.25059 18.1213 8.1192C16.5493 6.98702 14.4708 6 12.0003 6C10.229 6 8.65936 6.50733 7.33335 7.21175L8.82719 8.70559C9.78572 8.27526 10.8489 8 12.0003 8C13.9223 8 15.5986 8.76704 16.9524 9.7421C18.2471 10.6745 19.1995 11.7641 19.7215 12.436C19.1391 13.0547 18.1 14.0547 16.7703 14.9099C16.4172 15.137 16.0481 15.3511 15.6656 15.544Z'
        fill='#a3a3a3'
      />
      <path d='M4 5L19 20' stroke='#a3a3a3' strokeWidth='2' strokeLinecap='round' />
    </svg>
  );

export const UiBlockHeaderDisablePart = ({ disabled }: { disabled: string | undefined }) =>
  disabled && disabled.length !== 0 ? (
    disabled === 'false' ? null : (
      <svg fill='#a3a3a3' width='10px' height='10px' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
        <path d='M5,22H19a3,3,0,0,0,3-3V10a3,3,0,0,0-3-3H17V6A5,5,0,0,0,7,6V7H5a3,3,0,0,0-3,3v9A3,3,0,0,0,5,22ZM9,6a3,3,0,0,1,6,0V7H9ZM4,10A1,1,0,0,1,5,9H19a1,1,0,0,1,1,1v9a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1Zm6,4.5a2,2,0,1,1,2,2A2,2,0,0,1,10,14.5Z' />
      </svg>
    )
  ) : null;
