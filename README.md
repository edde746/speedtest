# speedtest

Run regularly scheduled speed tests, store the results in a database and display them in a web app.

## Usage

To use this you must read and agree to the [Speedtest EULA](https://www.speedtest.net/about/eula) and [GDPR](https://www.speedtest.net/about/privacy) policy.

### Docker

```bash
docker create \
    --name=speedtest \
    -p 3000:3000 \
    -v ./speedtest:/app/data \
    -e OOKLA_EULA_GDPR=true \
    --restart unless-stopped \
    edde746/speedtest:master
```

## Building

To build from source, run the following commands:

```bash
git clone https://github.com/edde746/speedtest.git
cd speedtest

pnpm install
pnpm run build
# or
docker build -t speedtest .
```

## Alternatives

- [henrywhitaker3/Speedtest-Tracker](https://github.com/henrywhitaker3/Speedtest-Tracker)

  A seeminlgly unmaintained project, `latest` image is missing arm64 build and startup time is very slow (in my experience).

- [alexjustesen/speedtest-tracker](https://github.com/alexjustesen/speedtest-tracker)

  Feature rich but requires PostgreSQL or MySQL making it more complicated to setup.
