import { test, expect, beforeEach, describe } from '@playwright/test'

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    const frontendAddress = 'http://localhost:5173';
    const backendAddress = 'http://localhost:3001';

    await request.post(`${backendAddress}/api/testing/reset`);
    await request.post(`${backendAddress}/api/users`, {
      data: {
        name: 'Tester',
        username: 'test',
        password: 'test'
      }
    });
    await request.post(`${backendAddress}/api/users`, {
      data: {
        name: 'Other',
        username: 'other',
        password: 'other'
      }
    });

    await page.goto(frontendAddress);
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByTestId('input_username')).toBeVisible();
    await expect(page.getByTestId('input_password')).toBeVisible();
    await expect(page.getByTestId('button_login')).toBeVisible();
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByTestId('input_username').fill('test');
      await page.getByTestId('input_password').fill('test');
      await page.getByTestId('button_login').click();

      await expect(page.getByText('Tester logged in')).toBeVisible();
    });

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByTestId('input_username').fill('test');
      await page.getByTestId('input_password').fill('something else');
      await page.getByTestId('button_login').click();

      const notification = page.locator('.notification');
      await notification.waitFor();
      await expect(notification).toContainClass('error');
      await expect(notification).toHaveText('wrong username or password');
    });
  });

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByTestId('input_username').fill('test');
      await page.getByTestId('input_password').fill('test');
      await page.getByTestId('button_login').click();
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByText('new blog').click();
      await page.getByTestId('input_title').fill('abc');
      await page.getByTestId('input_author').fill('def');
      await page.getByTestId('input_url').fill('ghi');
      await page.getByTestId('button_create').click();

      const blog = page.locator('.blog');
      await expect(blog).toBeVisible();
      await expect(blog.getByText('abc')).toBeVisible();
      await expect(blog.getByText('def')).toBeVisible();
    });

    describe('When a blog is expanded', () => {
      beforeEach(async ({ page }) => {
        await page.getByText('new blog').click();
        await page.getByTestId('input_title').fill('abc');
        await page.getByTestId('input_author').fill('def');
        await page.getByTestId('input_url').fill('ghi');
        await page.getByTestId('button_create').click();

        await page.getByText('view').click();
      })

      test('all information is visible', async ({ page }) => {
        await expect(page.getByText('ghi')).toBeVisible();
        await expect(page.getByText('likes 0')).toBeVisible();
        await expect(page.getByText('like')).toBeVisible();
      });

      test('the blog can be liked', async ({ page }) => {
        const likeButton = page.getByText('like');
        await expect(page.getByText('likes 0')).toBeVisible();
        await likeButton.click();
        await expect(page.getByText('likes 1')).toBeVisible();
        await likeButton.click();
        await expect(page.getByText('likes 2')).toBeVisible();
      });

      test('the blog can be deleted', async ({ page }) => {
        await expect(page.locator('.blog')).toHaveCount(1);

        page.on('dialog', dialog => dialog.accept());
        await page.getByText('delete').click();

        await expect(page.locator('.blog')).toHaveCount(0);
      });

      test('the blog can not be deleted by someone else', async ({ page }) => {
        await page.getByText('logout').click();
        await page.getByTestId('input_username').fill('other');
        await page.getByTestId('input_password').fill('other');
        await page.getByTestId('button_login').click();

        await expect(page.locator('.blog')).toHaveCount(1);

        await page.getByText('view').click();
        await expect(page.getByText('delete')).not.toBeAttached();
      });
    });

    test.only('blog are in sorted order by likes', async ({ page }) => {
      const items = ['abc', 'def', 'ghi', 'jkl'];
      for (const item of items) {
        await page.getByRole('button', { name: 'new blog' }).click();
        await page.getByTestId('input_title').fill(item);
        await page.getByTestId('input_author').fill(item);
        await page.getByTestId('input_url').fill(item);
        await page.getByTestId('button_create').click();
      }

      const blogs = await page.locator('.blog').all();
      for (const blog of blogs) {
        await blog.getByText('view').click();
      }

      for (let index = 0; index < 10; index++) {
        await page.getByRole('button', { name: 'like' }).first().click();
      }

      const likes = [];
      for (const blog of blogs) {
        const likesText = await (blog.getByText('likes')).textContent();
        const likesCount = parseInt(likesText.replace('likes ', ''));
        likes.push(likesCount);
      }

      expect(likes).toStrictEqual(likes.toSorted());
    });
  });
});