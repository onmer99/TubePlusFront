'use client';

import React, { ChangeEvent, useState } from 'react';
import { Avatar } from '@nextui-org/avatar';
import { Chip } from '@nextui-org/chip';
import { CardHeader } from '@nextui-org/card';
import { Button } from '@nextui-org/button';
import { Input, Textarea } from '@nextui-org/input';
import { Select, SelectItem } from '@nextui-org/select';
import { Selection } from '@nextui-org/table';
import { useSession } from 'next-auth/react';
import { communityCategory, languages } from '@/data/sidebar';
import SimpleCard from '@/components/SimpleCard';
import Link from 'next/link';
import { Pencil1Icon } from '@radix-ui/react-icons';

const communityInfo = [
  { id: 1, title: 'Category', value: '엔터테인먼트' },
  { id: 2, title: 'Members', value: '105' },
  { id: 3, title: 'Boards', value: '10' },
  { id: 3, title: 'Posts', value: '2201' },
  { id: 4, title: 'Created', value: '2023-11-03' },
];

export default function AccountPage() {
  const { data: session } = useSession();
  const userLang = languages.find(lang =>
    lang.locale.includes(session?.user.locale as string),
  );

  const [selectedLangValue, setSelectedLangValue] = useState<
    (typeof languages)[0]
  >(userLang!);
  const [category, setCategory] = useState<Selection>(new Set([]));
  const [bio, setBio] = useState('');

  const userRole =
    session?.user.role == 'ADMIN'
      ? session.user.role
      : session?.user.is_creator
      ? 'CREATOR'
      : session?.user.role;

  const handleSelectionChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedLanguage = languages.find(lang =>
      lang.name.includes(e.target.value),
    );

    if (selectedLanguage) {
      setSelectedLangValue(selectedLanguage);
    }
  };

  // const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
  //   setCategory(e.target.value);
  // };

  return (
    <section className="flex flex-col gap-8 min-h-[800px]">
      <SimpleCard classNames={{ card: '!p-0' }}>
        <CardHeader className="px-4 py-2 bg-default-200 border-b-1 border-default-300 rounded-none mb-4">
          <h2 className="px-2">Account Preferences</h2>
        </CardHeader>

        <div className="px-6 pb-6 flex flex-col gap-2 items-center border-b-1 border-default-300">
          <div className="grid grid-cols-5 flex-row gap-16 w-full text-sm">
            <h5 className="col-span-1 font-semibold whitespace-nowrap">
              Email
            </h5>

            <div className="col-span-4 flex justify-between">
              {session ? (
                <p className="pl-1">{session.user.email}</p>
              ) : (
                <p>Loading...</p>
              )}
              <Chip
                className="text-[.6rem] "
                color={
                  userRole === 'MEMBER'
                    ? 'success'
                    : userRole === 'ADMIN'
                    ? 'danger'
                    : 'warning'
                }
                variant="bordered"
              >
                {userRole}
              </Chip>
            </div>
          </div>

          <div className="grid grid-cols-5 flex-row gap-16 items-center w-full text-sm">
            <h5 className="col-span-1 min-w-unit-24 font-semibold whitespace-nowrap overflow-hidden text-ellipsis">
              <span className="md:inline x:hidden">Display</span> Language
            </h5>

            <div className="col-span-4 flex justify-between">
              <Select
                classNames={{ trigger: 'h-[28px]', innerWrapper: 'py-0' }}
                // userLang.name의 타입이 string | undefined 여서 확정적이지 않을 경우의 타입에러 발생
                defaultSelectedKeys={[userLang?.name || '한국어']}
                value={selectedLangValue?.name}
                onChange={handleSelectionChange}
                selectionMode="single"
                className="w-[200px]"
                variant="bordered"
                disallowEmptySelection
                startContent={
                  <span>
                    <Avatar
                      alt={selectedLangValue?.name || userLang?.name}
                      className="h-6 w-6"
                      isBordered={
                        selectedLangValue?.locale.includes('ja' || 'ko')
                          ? true
                          : false
                      }
                      src={selectedLangValue?.src || userLang?.src}
                    />
                  </span>
                }
              >
                {languages.map(lang => (
                  <SelectItem
                    key={lang.name}
                    value={lang.locale}
                    startContent={
                      <Avatar
                        alt={lang.name}
                        className="w-6 h-6"
                        src={lang.src}
                      />
                    }
                  >
                    {lang.name}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </div>
        </div>

        <CardHeader className="px-4 py-2 bg-default-200 border-b-1 border-default-300 rounded-none mb-4">
          <h2 className="px-2">Profile Preferences</h2>
        </CardHeader>

        <div className="px-6 pb-6 flex flex-col gap-2 items-center border-b-1 border-default-300">
          <div className="grid grid-cols-4 flex-row items-center gap-10 w-full text-sm">
            <div className="col-span-1 flex justify-center relative">
              <Avatar
                classNames={{
                  base: 'w-[200px] h-[200px] border border-default-300',
                }}
                src={session?.user.image as string}
                alt={session?.user.name as string}
              />
              <Button
                startContent={<Pencil1Icon />}
                className="absolute bottom-5 right-3 z-20 border border-default-600 shadow-none hover:shadow-md duration-300"
                size="sm"
              >
                Edit
              </Button>
            </div>
            <div className="col-span-3 flex flex-col gap-4">
              <div className="col-span-2 flex flex-col justify-between">
                <h5 className="col-span-1 min-w-unit-24 font-semibold whitespace-nowrap overflow-hidden text-ellipsis">
                  <span className="md:inline x:hidden">Display Name(</span>
                  Username
                  <span className="md:inline x:hidden">)</span>
                </h5>
                <Input
                  isReadOnly
                  type="text"
                  variant="bordered"
                  value={session?.user.username}
                />
              </div>

              <div className="relative col-span-3 flex flex-col">
                <h5 className="col-span-1 font-semibold whitespace-nowrap">
                  About(Bio)
                </h5>
                <Textarea
                  classNames={{ input: 'mb-4' }}
                  // isReadOnly
                  minRows={2}
                  variant="bordered"
                  value={bio || 'Add a bio'}
                  onValueChange={setBio}
                  isInvalid={bio.length > 255}
                />
                <p className="absolute right-2 bottom-1 text-default-500 text-small">
                  {bio.length}/255
                </p>
              </div>
            </div>
          </div>
        </div>
      </SimpleCard>

      {session?.user.is_creator ? (
        <SimpleCard classNames={{ card: '!p-0' }}>
          <CardHeader className="px-4 py-2 bg-default-200 border-b-1 border-default-300 rounded-none mb-4">
            <h2 className="px-2">Creator Registration</h2>
          </CardHeader>

          <div className="px-6 pb-6 flex flex-col gap-2 items-between border-b-1 border-default-300">
            <p className="text-sm">
              Are you already a creator, or do you want to be a creator? Start
              by creating a community on TubePlus!
            </p>
            <div className="grid grid-cols-4 flex-row items-start md:gap-8 x:gap-4 w-full text-sm">
              <Select
                classNames={{
                  base: 'col-span-3 !w-full',
                }}
                label="Community Category"
                description="Select a category for the community"
                selectedKeys={category}
                onSelectionChange={setCategory}
                // onChange={handleCategoryChange}
                selectionMode="single"
                className="w-[200px]"
                variant="bordered"
              >
                {communityCategory.map(cate => (
                  <SelectItem key={cate.code} value={cate.label}>
                    {cate.label}
                  </SelectItem>
                ))}
              </Select>

              <div className="flex h-14 items-center w-full">
                <Link
                  className="flex justify-center items-center
                            w-full h-2/3
                            text-base text-default-foreground hover:text-default-50
                            bg-default-200 hover:bg-default-800 duration-200
                            rounded-xl"
                  href={{
                    pathname: '/settings/community/new',
                    query: {
                      category: Object.values(category),
                    },
                  }}
                >
                  Register
                </Link>
              </div>
            </div>
          </div>
        </SimpleCard>
      ) : (
        <SimpleCard classNames={{ card: '!p-0' }}>
          <CardHeader className="px-4 py-2 bg-default-200 border-b-1 border-default-300 rounded-none mb-4">
            <h2 className="px-2">My Community</h2>
          </CardHeader>
          <div className="px-6 pb-6 flex flex-col gap-2 items-between border-b-1 border-default-300">
            <div className="flex flex-row items-center gap-4 justify-between">
              <div className="flex items-center gap-2">
                <Avatar src={''} alt={'Community avatar'} size="lg" />

                <div className="flex flex-col gap-1">
                  <h3>{'Community Name'}</h3>
                  <p className="text-sm font-light line-clamp-3">
                    {'Community description'}
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                {communityInfo.map(info => (
                  <dl
                    key={info.id}
                    className="flex flex-col gap-2 min-w-[80px]"
                  >
                    <dt>{info.title}</dt>
                    <dd className="text-tiny">{info.value}</dd>
                  </dl>
                ))}
              </div>
            </div>
          </div>
        </SimpleCard>
      )}

      <SimpleCard
        classNames={{
          base: '!border-danger-300',
          card: '!p-0',
        }}
      >
        <CardHeader className="px-4 py-2 bg-danger-200 border-b-1 border-danger-300 rounded-none mb-4">
          <h2 className="px-2 text-danger-600 font-semibold text-xl">
            Delete account
          </h2>
        </CardHeader>
        <div className="px-6 pb-6 grid grid-cols-4 gap-8 items-center">
          <p className="col-span-3 text-justify md:text-sm x:text-xs">
            If you press the Delete button, your account will be completely
            removed from the tubePlus. Even if your account is deleted from
            tubePlus, it will not be deleted from YouTube.
          </p>
          <Button
            className="opacity-60 hover:opacity-100"
            color="danger"
            variant="ghost"
          >
            Delete
            <span className="sm:inline x:hidden"> your account</span>
          </Button>
        </div>
      </SimpleCard>
    </section>
  );
}
